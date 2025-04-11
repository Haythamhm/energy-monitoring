using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiWithJwtRole.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByAdminIdToApplicationUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedByAdminId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByAdminId",
                table: "AspNetUsers");
        }
    }
}
